import TiptapParser from "tiptap-parser";


export default function RichTextParser({content} : {content: string}){
    return (
    <TiptapParser content={content}  containerClassName="tiptap" />
    );
}