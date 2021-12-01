import React, { useState } from 'react'
import { Modal, WalletForm } from 'components'
import {useNavigate} from "react-router-dom"
import Wallets from './Wallets'

interface Props {
    wallet?: boolean;
    toggleWallet?: () => void;
}


export const Navbar = ({wallet, toggleWallet}: Props) => {
    const navigate = useNavigate()

    const [connectModal, setConnectModal] = useState(false);

    const [modal, setModal] = React.useState({open: false, type: ""})
    const openModal = (open: boolean, type: string) => setModal({open, type})
    const closeModal = () => setModal({open: false, type: ""})

    return (
        <div>
            <nav>
            <img src="/icons/xend-logo-white.svg" alt="logo" className="logo" 
                onClick={() => navigate("/")}
            />
               <Wallets setOpen={setConnectModal} open={openModal} close={closeModal} />
            </nav>

            {/* <ConnectionModal
                open={connectModal}
                setOpen={setConnectModal} 
            /> */}
            <Modal
                modalOpen={modal.open}
                modalClose={closeModal}
                closeIcon
                title={`${modal.type === "connect-wallet" ? "Connect Wallet" : modal.type === "disconnect" ? "Disconnect Wallet" : ""}`}
                modalChild={<WalletForm close={closeModal} />}
                // modalChild={modal.open && modal.type === "connect-wallet" 
                //     ? <ConnectionModal open={modal.open} setOpen={setModal} />
                //     : modal.type === "show-wallet" ? <DisconnectWalletForm close={closeModal} toggleWallet={toggleWallet} />
                //     : null
                // }
                className={`${modal.type === "connect-modal" && "connect-modal"}`}
            />
        </div>
    )
}





// import React, { useState } from 'react'
// import { Button, CapsuleBtn, Modal, WalletConnectedForm, ConnectWalletForm } from 'components'
// import {useNavigate} from "react-router-dom"
// import Wallets from './Wallets'
// import ConnectionModal from './ConnectionModal'

// interface Props {
//     wallet?: boolean;
//     toggleWallet?: () => void;
// }

// const ConnectWallet = () => (
//     <div className="connect-wallet">
//         <img src="/icons/connect-wallet.svg" alt="wallet" className="wallet-img" />
//         <span>Connect Wallet</span>
//     </div>
// )

// export const Navbar = ({wallet, toggleWallet}: Props) => {
//     const navigate = useNavigate()

//     const [connectModal, setConnectModal] = useState(false);

//     return (
//         <div>
//             <nav>
//             <img src="/icons/xend-logo-white.svg" alt="logo" className="logo" 
//                 onClick={() => navigate("/")}
//             />
//                <Wallets setOpen={setConnectModal} />
//             </nav>

//             <ConnectionModal
//                     open={connectModal}
//                     setOpen={setConnectModal} />
//             {/* <Modal
//                 modalOpen={modal.open}
//                 modalClose={closeModal}
//                 closeIcon
//                 title={`${modal.type === "connect-wallet" ? "Connect Wallet" : modal.type === "show-wallet" ? "Connected" : ""}`}
//                 modalChild={modal.open && modal.type === "connect-wallet" 
//                     ? <ConnectWalletForm close={closeModal} toggleWallet={toggleWallet} />
//                     : modal.type === "show-wallet" ? <WalletConnectedForm close={closeModal} toggleWallet={toggleWallet} />
//                     : null
//                 }
//                 className={`${modal.type === "connect-modal" && "connect-modal"}`}
//             /> */}
//         </div>
//     )
// }
