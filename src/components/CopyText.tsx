import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import InlineSVG from 'react-inlinesvg';

interface props {
    text: string
}

export const CoptText = ({text}: props) => {
    const [copied, setCopied] = useState(false);
    return (
        <>
            <CopyToClipboard 
                text={text}
                onCopy={()=>setCopied(true)}
            >
                <button className='flex items-center gap-2 bg-slate-200 p-2 rounded-md'>
                    <InlineSVG
                        src="/images/copy.svg"
                        className="fill-current h-6 text-slate-800"
                    />
                    {copied ? "Copied!" : "Copy"}
                </button>
            </CopyToClipboard>
        </>
    )
}