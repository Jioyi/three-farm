import React from 'react';
import EngineGame from '../EngineGame';

interface UserProviderProps {
    children: React.ReactNode;
}

const UserContext = React.createContext({
    setEngine: (_EngineGame: EngineGame) => {},
    testFunct: (_string: string) => {}
});

export const UserContextProvider = ({ children }: UserProviderProps) => {
    const [Engine, setEngine] = React.useState<EngineGame>();

    const values = React.useMemo(
        () => ({
            testFunct: (_string: string) => {
                if (Engine) {
                    Engine.testFunct(_string);
                }
            },
            setEngine: (_EngineGame: EngineGame) => {
                setEngine(_EngineGame);
            }
        }),
        [Engine]
    );

    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
    return React.useContext(UserContext);
};
