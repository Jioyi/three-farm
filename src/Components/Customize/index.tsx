import React, { useState } from 'react';
import { listAvatar } from './listAvatar';
import Styles from './Customize.module.css';

const Customize = () => {
    const [avatar, SetAvatar] = useState('1.jpg');
    const [nickname, setNickname] = useState('Jioyi');
    const handelNickname = (e: any) => {
        setNickname(e.target.value);
    };
    return (
        <div className={Styles['container']}>
            <p>customize</p>
            <input name="nickname" placeholder="nickname" value={nickname} onChange={handelNickname} />
            <div className={Styles['panel-avatars']}>
                {listAvatar.map((image, index) => {
                    return (
                        <img
                            onClick={() => {
                                SetAvatar(image);
                            }}
                            key={`img-${index}`}
                            className={Styles[`panel-item-${avatar === image ? '0' : '1'}`]}
                            src={`./assets/avatars/${image}`}
                            alt="avatar"
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Customize;
