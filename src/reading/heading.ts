// The size of the heading of a chapter on the reading page. docs/DESIGN.md section 7.5.

/**
 * The width of the heading in em of its font size: the name in capitals, the gap, and the number.
 * An Inrond ExtraBold capital is about 0.8 em wide at most on average. The heading font size is
 * limited so that a long name, such as "1 Thessalonians", fits the column.
 */
export function headingWidthEm(name: string, chapter: number): number {
  return name.length * 0.8 + 0.24 + String(chapter).length * 0.62
}
