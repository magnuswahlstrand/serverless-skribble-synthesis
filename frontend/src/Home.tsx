import {trpc2Vanilla} from "./utils/trpc";
import {ReactSketchCanvas, ReactSketchCanvasRef} from "react-sketch-canvas";
import {MutableRefObject, useRef, useState} from "react";

function dataURItoBlob(dataURI: string) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
}

async function uploadImage(imageDataUrl: Promise<string>, prompt: string) {
    const upload = await trpc2Vanilla.getUploadUrl.query(prompt)
    console.log("upload", upload)

    const blob = dataURItoBlob(await imageDataUrl)

    const body = new FormData();
    Object.entries(upload.fields).map(([key, value]) =>
        body.append(key, value),
    );
    body.append("file", blob);
    console.log("id", upload.id)
    const response = await fetch(upload.url, {
        method: "POST",
        body,
    });

    if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
    }
    return upload.id;
}

export default function Home() {
    const [data, setData] = useState<string[]>(['some-id']);
    const [aiPrompt, setPrompt] = useState<string>("a cool cat");

    const canvasRef: MutableRefObject<ReactSketchCanvasRef> | undefined = useRef<ReactSketchCanvasRef>(null!);

    const onSubmit = (e: any) => {
        e.preventDefault()

        const dataUrl = canvasRef?.current.exportImage("png")
        uploadImage(dataUrl, aiPrompt).then((id) => {
            setData((prevIds) => [id, ...prevIds])
        }).catch(error => {
            console.log("error", error)
        })
    }


    return (
        <div className={""}>

            <ReactSketchCanvas
                ref={canvasRef}
                width="200"
                height="200"
                strokeWidth={4}
                strokeColor="red"
                className={"w-96 h-96"}
            />
            <input type={"text"} value={aiPrompt} onChange={(e) => setPrompt(e.target.value)}
                   placeholder={"Enter a prompt to display an image"}/>

            <form className={""} onSubmit={onSubmit}>
                <input type="text" name="prompt" placeholder="Enter a prompt to display an image"/>
                <button type="submit" className={"bg-black text-white rounded p-2"}>Go!</button>

            </form>
            <button onClick={() => canvasRef.current.clearCanvas()} className={"bg-blue-500 text-white rounded p-2"}>CLEAR</button>
            {data.map((key) =>
                <div key={key}>{key}</div>
            )}


            {/*{error && <div>{error}</div>}*/}

            {/*{prediction && (*/}
            {/*    <div>*/}
            {/*        {prediction.output && (*/}
            {/*            <div className={styles.imageWrapper}>*/}
            {/*                <img*/}
            {/*                    src={prediction.output[prediction.output.length - 1]}*/}
            {/*                    alt="output"*/}
            {/*                    sizes='100vw'*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*        <p>status: {prediction.status}</p>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    )
}