import React, { useEffect } from 'react'
import Notification from '../components/core/Notifier';
import { Footer, Navbar, Modal } from 'components'
import { PackagesCard } from 'components/Cards'
import {useNavigate} from "react-router-dom"
import {Staking} from "./Staking"
import { useDispatch, useSelector } from 'react-redux'
import GetCategories from 'methods/contracts/actions/getCategories'
import GetUserInfo from 'methods/contracts/actions/getUserInfo'
import GetUserXendBalance from 'methods/contracts/actions/getUserXendBalance'
import GetTotalStaked from 'methods/contracts/actions/getTotalStaked'
import GetUserStakedCategories from 'methods/contracts/actions/getUserStakedCategories'
import { notify } from 'components/core/Notifier'
import { recreateWeb3 } from 'utils/useAuth';
import SmallSideLoader from 'components/core/SmallSideLoader';

interface Props {
    
}

export const Home = (props: Props) => {
    const navigate = useNavigate()

    const [modal, setModal] = React.useState({open: false, type: "",categoryId:null})
    const openModal = (open: boolean, type: string,categoryId:any) => setModal({open, type,categoryId})
    const closeModal = () => setModal({open: false, type: "",categoryId:null})


	const { address,categories,userInfo,xendBalance,totalStakedContract,totalStakedUSD,loadingData} = useSelector((store: any) => store.DashboardReducer)
    
    const dispatch = useDispatch();

    const [wallet, setWallet] = React.useState(false)
    const toggleWallet = () => setWallet(!wallet)
    
    useEffect(() => {
		if (typeof address !== 'undefined' && address) {
           
			dispatch(GetUserInfo(address));
            dispatch(GetUserXendBalance(address));
            dispatch(GetUserStakedCategories(address));
           
		}
	}, [address]);


    useEffect(() => {
        dispatch(GetCategories());
        dispatch(GetTotalStaked());
        dispatch(recreateWeb3());
	}, []);


    return (
        <div className="home">
           
            <Navbar />
            <main className="home-main">
                <section className="step-1">
                    <p id="topic">Stake XEND and Earn upto 100% APY in XEND Token</p>
                    <div className="locker">
                        <div className="lock-left">
                            <p id="title">Total Value Locked</p>
                            <p className="val">{totalStakedContract} XEND</p>
                            <p className="amount">{totalStakedUSD}</p>
                        </div>
                        <img src="/icons/wallet.svg" alt="wallet" className="wallet-img" />
                    </div>
                </section>

                <section className="step-2">
                    {!address ? 
                        (
                            <>
                                <p id="connect">Connect Wallet</p>
                                <p id="dets">Connect wallet to see your balance</p>
                            </>
                        ) :
                        (
                            <div className="non-empty">
                                <div className="left-2">
                                   
                                    <div className="box-2">
                                        <p className="prop">Staking Balance</p>
                                        {!loadingData?<p className="val">{userInfo.staked} XEND</p>:<SmallSideLoader />}
                                        {!loadingData?<p className="amount">{userInfo.stakedUSD}</p>:<SmallSideLoader />}
                                    </div>
                                    <div className="box-2">
                                        <p className="prop">All Time Rewards</p>
                                        {!loadingData?<p className="val">{userInfo.reward} XEND</p>:<SmallSideLoader />}
                                        {!loadingData?<p className="amount">{userInfo.rewardUSD}</p>:<SmallSideLoader />}
                                    </div>
                                 
                                </div>
                                <div>

                                </div>
                                <div className="right-2">
                                    <div className="pointer active" onClick={() => navigate("/active-staking")}>
                                        <p className="label">Active Staking</p>
                                        <img src="/icons/arrow-right.svg" alt="click" id="arrow" />
                                    </div>
                                    <div className="pointer" onClick={() => navigate("/history")}>
                                        <p className="label">History</p>
                                        <img src="/icons/arrow-right.svg" alt="click" id="arrow" />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </section>

                <section className="step-3">
                       { 
                categories.map((entry, i) => (
                    <PackagesCard
                    type={entry.name}
                    apy={entry.apy}
                    limit={entry.limit}
                    totalStakedInCategory={entry.totalStakedInCategory}
                    buttonText={address?"Stake":"Connect Wallet"}                    
                    id="orange-bg"
                    action={() => setModal({open: true, type: "stake",categoryId:i})}
                    address = {address}
                />
                ))
                }
                  
                </section>
            </main>
            <Footer/>

            <Modal
                modalOpen={modal.open}
                modalClose={closeModal}
              
                modalChild={modal.open && modal.type === "stake" && 
                <Staking
                     categoryId={modal.categoryId}
                     categories={categories}
                     userXendBalance={xendBalance}
                     address = {address}
                     action={() => setModal({open: false, type: "stake",categoryId:modal.categoryId})}                      
                 />
                }
                
              
                
                className={`${modal.type === "stake" && "stake-modal"}`}
            />
        </div>
    )
}
