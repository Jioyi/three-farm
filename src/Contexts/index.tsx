import React from 'react';
import EngineGame from '../EngineGame';
import { GameData } from '../EngineGame/interfaces';

interface UserProviderProps {
    children: React.ReactNode;
}

const UserContext = React.createContext({
    setEngine: (_EngineGame: EngineGame) => {},
    toggleCustomize: () => {},
    toggleStore: () => {},
    toggleSettings: () => {},
    createGameObject: (_nameAssets: string) => {},
    changeVolume: (_volume: number) => {},
    eventGameHandler: (...args: any[]) => {},
    setAvatarImage: (...args: any[]) => {},
    loading: false,
    progress: 0,
    gameData: {} as any,
    avatar: {
        level: 1,
        exp: 100,
        expTotal: 200
    },
    money: 0,
    avatarImage: 1,
    openCustomize: false,
    openStore: false,
    openSettings: false
});

export const UserContextProvider = ({ children }: UserProviderProps) => {
    const [Engine, setEngine] = React.useState<EngineGame>();
    const [gameData, setGameData] = React.useState<GameData>();
    const [money, setMoney] = React.useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [avatar, setAvatar] = React.useState({
        level: 1,
        exp: 100,
        expTotal: 200
    });

    const [avatarImage, setAvatarImage] = React.useState(1);
    const [openStore, setOpenStore] = React.useState(false);
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
            setAvatarImage,
            eventGameHandler,
            loading,
            progress,
            gameData,
            avatar,
            money,
            avatarImage,
            openCustomize,
            openStore,
            openSettings
        }),
        [Engine, loading, progress, gameData, avatar, money, avatarImage, openCustomize, openStore, openSettings]
    );

    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
    return React.useContext(UserContext);
};
