import { OrthographicCamera } from "@react-three/drei"


export const SceneSettings = () => {

    return (
        <>
            <color attach="background" args={['#050505']} />
            <ambientLight />
            <OrthographicCamera makeDefault position={[100, 75, 100]} zoom={7} />
            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        </>
    )
}