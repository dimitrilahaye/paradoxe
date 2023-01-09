export type Coordinates = { x: number, y: number };
export type PlayerDirection = 'left' | 'right';

export enum SceneKey {
    BaseLevel = 'BaseLevel',
    PreloadStartScreen = 'PreloadStartScreen',
    StartScreen = 'StartScreen',
    PreloadTutorials = 'PreloadTutorials',
    Tutorials = 'Tutorials',
    PreloadLevel0 = 'PreloadLevel0',
    Level0 = 'Level0',
    PreloadLevel1 = 'PreloadLevel1',
    Level1 = 'Level1',
    PreloadLevel2 = 'PreloadLevel2',
    Level2 = 'Level2',
    PreloadLevel3 = 'PreloadLevel3',
    Level3 = 'Level3',
    PreloadLevel4 = 'PreloadLevel4',
    Level4 = 'Level4',
    PreloadLevel5 = 'PreloadLevel5',
    Level5 = 'Level5',
    PreloadLevel6 = 'PreloadLevel6',
    Level6 = 'Level6',
    PreloadLevel7 = 'PreloadLevel7',
    Level7 = 'Level7',
    PreloadLevel8 = 'PreloadLevel8',
    Level8 = 'Level8',
}

export enum ObjectName {
    DOOR_START = 'start',
    CORPSE = 'corpse',
    DOOR_END = 'end',
    START = 'start',
    END = 'end',
    STAIRS_LINE = 'stairs_line',
    SPATIAL_DOOR = 'spatial_door',
}

export enum LayerName {
    // objects
    EVENTS = 'events',
    DIALOGS = 'dialogs',
    SPATIAL_TELEPORTERS = 'spatial_teleporters',
    TIME_TELEPORTERS = 'time_teleporters',
    TIME_SWITCHERS = 'time_switchers',
    PLAYER = 'player',
    DOORS = 'doors',
    STAIRS_DETECTION = 'stairs_detection',
    
    // tiles
    CEILING = 'ceiling',
    LIGHTS = 'lights',
    OPTIONS = 'options',
    PLATFORMS = 'platforms',
    DESKS = 'desks',
    WALL2 = 'wall2',
    WALL = 'wall',
    BRIDGES = 'bridges',
    TP = 'tp',
    GROUND = 'ground',
    BACKGROUND = 'background',
    STAIRS = 'stairs',
    PLATFORM_COLLIDERS = 'platform_colliders',
    TITLE = 'title',
}

export enum Depth {
    PLAYER = 1,
    BRIDGES = 2,
    UI = 3,
    TEXT_BOX = 4,
}