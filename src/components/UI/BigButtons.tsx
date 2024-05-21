import { BasicPanelWrapper } from "./BasicPanelWrapper"

export const BigButtons = ({text, onClick}: {text: string, onClick: () => void}) => {
    return (
			<BasicPanelWrapper styles="hover:bg-uilines h-12" augUi={`border tl-clip br-clip --aug-border-bg`}>
				<button
					className=" orbitron w-full h-full text-base text-uitext text-center cursor-pointer hover:text-neutral-900"
					onClick={onClick}
				>
					{ text }
				</button>
			</BasicPanelWrapper>
		)
}