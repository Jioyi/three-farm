import React from 'react';
import EngineGame from '../EngineGame';
import { Day, GameData, SlostData } from '../EngineGame/interfaces';

interface UserProviderProps {
    children: React.ReactNode;
}

const UserContext = React.createContext({
    setEngine: (_EngineGame: EngineGame) => {},
    toggleCustomize: () => {},
    toggleStore: () => {},
    toggleCalendar: () => {},
    toggleGameMap: () => {},
    toggleSettings: () => {},
    createGameObject: (_nameAssets: string) => {},
    changeVolume: (_volume: number) => {},
    eventGameHandler: (...args: any[]) => {},
    setAvatarImage: (...args: any[]) => {},
    setAvatarNickname: (...args: any[]) => {},
    buySlot: (_x: number, _y: number) => {},
    sellSlot: (_x: number, _y: number) => {},
    loading: true,
    progress: 0,
    gameData: {} as any,
    avatar: {
        level: 1,
        exp: 100,
        expTotal: 200
    },
    money: 0,
    storage: 0,
    avatarImage: 1,
    avatarNickname: 'Jioyi',
    openCustomize: false,
    openStore: false,
    openCalendar: false,
    openGameMap: false,
    openSettings: false,
    slots: undefined as any,
    forecast: undefined as any
});

export const UserContextProvider = ({ children }: UserProviderProps) => {
    const [Engine, setEngine] = React.useState<EngineGame>();
    const [gameData, setGameData] = React.useState<GameData>();
    const [slots, setSlots] = React.useState<SlostData[][]>();

    const [money, setMoney] = React.useState(0);
    const [storage, setStorage] = React.useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [avatar, setAvatar] = React.useState({
        level: 1,
        exp: 100,
        expTotal: 200
    });

    const [forecast, setForecast] = React.useState<Day[]>();
    const [avatarImage, setAvatarImage] = React.useState(2);
    const [avatarNickname, setAvatarNickname] = React.useState('Jioyi');

    const [openStore, setOpenStore] = React.useState(false);
    const [openCalendar, setOpenCalendar] = React.useState(false);
    const [openGameMap, setOpenGameMap] = React.useState(false);
    const [openCustomize, setOpenCustomize] = React.useState(false);
    const [openSettings, setOpenSettings] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [progress, setProgress] = React.useState(0);

    const eventGameHandler = ({ type, data }: any) => {
        switch (type) {
            case 'loading':
                setLoading(data);
                break;
            case 'progress':
                setProgress(data);
                break;
            case 'setGameData':
                setGameData(data);
                break;
            case 'setMoney':
                setMoney(data);
                break;
            case 'setStorage':
                setStorage(data);
                break;
            case 'setAvatarNickname':
                setAvatarNickname(data);
                break;
            case 'setSlots':
                setSlots(data);
                break;
            case 'setForecast':
                setForecast(data);
                break;
        }
    };

    const values = React.useMemo(
        () => ({
            setEngine: (_EngineGame: EngineGame) => {
                setEngine(_EngineGame);
            },
            setGameData: (_dameData: GameData) => {
                setGameData(_dameData);
            },
            toggleCustomize: () => {
                setOpenCustomize((prevMode) => !prevMode);
            },
            toggleStore: () => {
                setOpenStore((prevMode) => !prevMode);
            },
            toggleCalendar: () => {
                setOpenCalendar((prevMode) => !prevMode);
            },
            toggleGameMap: () => {
                setOpenGameMap((prevMode) => !prevMode);
            },
            toggleSettings: () => {
                setOpenSettings((prevMode) => !prevMode);
            },
            createGameObject: (_nameAssets: string) => {
                if (Engine) {
                    Engine.createGameObject(_nameAssets);
                }
            },
            changeVolume: (_volume: number) => {
                if (Engine) {
                    Engine.changeVolume(_volume);
                }
            },
            buySlot: (_x: number, _y: number) => {
                if (Engine) {
                    Engine.buySlot(_x, _y);
                }
            },
            sellSlot: (_x: number, _y: number) => {
                if (Engine) {
                    Engine.sellSlot(_x, _y);
                }
            },
            setAvatarImage,
            setAvatarNickname,
            eventGameHandler,
            loading,
            progress,
            gameData,
            avatar,
            money,
            storage,
            forecast,
            avatarImage,
            avatarNickname,
            openCustomize,
            openStore,
            openCalendar,
            openGameMap,
            openSettings,
            slots
        }),
        [
            Engine,
            loading,
            progress,
            gameData,
            avatar,
            money,
            storage,
            forecast,
            avatarImage,
            avatarNickname,
            openCustomize,
            openStore,
            openCalendar,
            openGameMap,
            openSettings,
            slots
        ]
    );

    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
    return React.useContext(UserContext);
};
