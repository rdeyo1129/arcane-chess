import React from 'react';
import './ArcanaList.scss';
import 'src/chessground/styles/normal.scss';
import arcanaJson from 'src/data/arcana.json';
import Button from 'src/components/Button/Button';

interface ArcanaDetail {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active' | 'inherent' | string;
  imagePath: string;
}

type ArcanaMap = Record<string, ArcanaDetail>;
const arcana: ArcanaMap = arcanaJson as ArcanaMap;

interface ArcanaListProps {
  // isOpen: boolean; // kept for compatibility; not used here
  // updateHover: (arcane: ArcanaDetail | null) => void;
  // handleToggle: () => void; // kept for compatibility; not used here
  // updateSlot: (arcane: ArcanaDetail) => void; // kept for compatibility; not used here
}

interface ArcanaListState {
  hoverId: string;
  expandedSections: Record<string, boolean>;
}

const sectionPrefixes = ['sumn', 'dyad', 'shft', 'offr', 'swap', 'mods'];

export default class ArcanaList extends React.Component<
  ArcanaListProps,
  ArcanaListState
> {
  state: ArcanaListState = {
    hoverId: '',
    expandedSections: {},
  };

  toggleSection = (prefix: string) => {
    this.setState((prev) => ({
      expandedSections: {
        ...prev.expandedSections,
        [prefix]: !prev.expandedSections[prefix],
      },
    }));
  };

  renderArcanaItem = (key: string, arcaneItem: ArcanaDetail) => (
    <div key={key} className="arcane-item">
      <img
        className="thumb"
        src={`${arcaneItem.imagePath}.svg`}
        alt={arcaneItem.name}
      />
      <div className="content">
        <div className="title-row">
          <div className="name">{arcaneItem.name}</div>
          <div
            className={`type pill pill-${
              arcaneItem.type?.toLowerCase?.() || 'unknown'
            }`}
          >
            {arcaneItem.type}
          </div>
        </div>
        <div className="description">{arcaneItem.description}</div>
      </div>
    </div>
  );

  render() {
    const entries = Object.entries(arcana).filter(([, a]) => a.id !== 'empty');

    const grouped: Record<string, [string, ArcanaDetail][]> = {};
    const others: [string, ArcanaDetail][] = [];

    entries.forEach(([key, arc]) => {
      const prefix = sectionPrefixes.find((pref) => arc.id.startsWith(pref));
      if (prefix) {
        (grouped[prefix] ||= []).push([key, arc]);
      } else {
        others.push([key, arc]);
      }
    });

    return (
      <div className="arcane-list">
        <div className="types-header">
          <span>Spells that bend the rules of the game. More to follow.</span>
          <hr />
          <span>Arcana Types</span>
          <ul>
            <li>
              <strong>Active</strong>: Single-use actions you choose when to
              fire.
            </li>
            <li>
              <strong>Passive</strong>: Single-use effects that trigger once
              when you play them.
            </li>
            <li>
              <strong>Inherent</strong>: Always-on, permanent effects once
              equipped.
            </li>
          </ul>
        </div>

        <div className="inventory vertical">
          {others.map(([key, item]) => this.renderArcanaItem(key, item))}

          {sectionPrefixes.map((prefix) => {
            const items = grouped[prefix];
            if (!items || items.length === 0) return null;

            const expanded = !!this.state.expandedSections[prefix];
            return (
              <div
                key={prefix}
                className={`arcane-section${expanded ? ' is-open' : ''}`}
                onClick={() => {
                  if (expanded) {
                    this.toggleSection(prefix);
                  }
                }}
              >
                <Button
                  text={prefix.toUpperCase()}
                  className="tertiary"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.toggleSection(prefix);
                  }}
                  color="S"
                  width={400}
                  height={40}
                  disabled={false}
                  backgroundColorOverride={
                    prefix === 'sumn'
                      ? 'linear-gradient(135deg, #8e2de2, #4a00e0)'
                      : prefix === 'dyad'
                      ? 'linear-gradient(135deg, #00c6ff, #0072ff)'
                      : prefix === 'shft'
                      ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                      : prefix === 'offr'
                      ? 'linear-gradient(135deg, #ff512f, #dd2476)'
                      : prefix === 'swap'
                      ? 'linear-gradient(135deg, #43cea2, #185a9d)'
                      : prefix === 'mods'
                      ? 'linear-gradient(135deg, #ff9f1c, #ff2e63)'
                      : '#55555588'
                  }
                />
                {expanded && (
                  <div className="arcane-section-list">
                    {items.map(([key, item]) =>
                      this.renderArcanaItem(key, item)
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
