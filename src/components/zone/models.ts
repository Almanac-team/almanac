export interface Region {
    id: string;
    from: number;
    to: number;
}

export interface ZoneInfo {
    id: string;
    name: string;
    color: string;
    regions?: Region[];
}
