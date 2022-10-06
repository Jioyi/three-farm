import React, { useState } from 'react';
import Styles from './Bank.module.css';

const Bank = () => {
    const [stateBank, setStateBank] = useState({
        amount: 50000,
        totalDebts: 0,
        rate: 15,
        creditLimit: 50000,
        num: ''
    });
    const handelNum = (e: any) => {
        if (stateBank.num.length > 0) {
            setStateBank({ ...stateBank, num: stateBank.num + e.target.value });
        } else if (e.target.value !== '0') {
            setStateBank({ ...stateBank, num: stateBank.num + e.target.value });
        }
    };
    const deleteNum = () => {
        setStateBank({ ...stateBank, num: stateBank.num.substring(0, stateBank.num.length - 1) });
    };
    const resetNum = () => {
        setStateBank({ ...stateBank, num: '' });
    };
    const repay = () => {
        if (stateBank.num !== '' && Number(stateBank.num) <= Number(stateBank.totalDebts)&& Number(stateBank.num)<=stateBank.amount) {
            let actualNum = Number(stateBank.num);
        setStateBank({
            ...stateBank,
            totalDebts:stateBank.totalDebts - actualNum,
            amount:stateBank.amount - actualNum,
            creditLimit:stateBank.creditLimit+ Math.trunc(actualNum*1.5),
            num:''
        })
        }
    };
    const withdraw = () => {
        if (stateBank.num !== '' && stateBank.creditLimit >= Number(stateBank.num)) {
            let actualNum = Number(stateBank.num);
            setStateBank({
                ...stateBank,
                totalDebts: Math.trunc(stateBank.totalDebts + actualNum * (100 + stateBank.rate)/100),
                creditLimit: stateBank.creditLimit - actualNum,
                num: '',
                rate:stateBank.rate+5,
                amount: stateBank.amount + actualNum
            });
        }
    };
    return (
        <div className={Styles['container']}>
            <p>bank</p>
            <div className={Styles['dashboard']}>
                <p>&gt;CASH AVIABLE:{` ${stateBank.amount}`}</p>
                <p>&gt;TOTAL DEBTS:{` ${stateBank.totalDebts}`}</p>
                <p>&gt;CREDIT LIMIT:{` ${stateBank.creditLimit}`}</p>
                <div>
                    <p>INTERES RATE:{` ${stateBank.rate}`}</p>
                    <p>QUARTERLY PAYMENT:{` ${stateBank.totalDebts}`}</p>
                </div>
                USE KEYPAD TO ENTER MOUNT LOAD AMOUNT {stateBank.num}
                <div className={Styles['panel-num']}>
                    <button value={7} onClick={handelNum}>
                        7
                    </button>
                    <button value={8} onClick={handelNum}>
                        8
                    </button>
                    <button value={9} onClick={handelNum}>
                        9
                    </button>
                    <button onClick={resetNum}>C</button>
                    <button value={4} onClick={handelNum}>
                        4
                    </button>
                    <button value={5} onClick={handelNum}>
                        5
                    </button>
                    <button value={6} onClick={handelNum}>
                        6
                    </button>
                    <button onClick={deleteNum}>&lt;</button>
                    <button value={1} onClick={handelNum}>
                        1
                    </button>
                    <button value={2} onClick={handelNum}>
                        2
                    </button>
                    <button value={3} onClick={handelNum}>
                        3
                    </button>
                    <button value={0} onClick={handelNum}>
                        0
                    </button>
                </div>
                <button onClick={repay}>REPAY</button>
                <button onClick={withdraw}>WITHDRAW</button>
            </div>
        </div>
    );
};

export default Bank;
