import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import InlineSVG from 'react-inlinesvg';

interface props {
    text: string
}

export const CoptText = ({text}: props) => {
    const [copied, setCopied] = useState(false);
    const [pop, setPop] = useState(false)

    useEffect(()=>{
        if(pop){
            setTimeout(()=>setPop(false), 3000)
        }
    },[pop])

    const handleCopy = ()=> {
        setCopied(true);
        setPop(true);
    }
    return (
        <>
            <CopyToClipboard 
                text={text}
                onCopy={handleCopy}
            >
                <button className='flex items-center gap-2 bg-slate-200 py-2 px-3 rounded-md relative'>
                    <InlineSVG
                        src="/images/copy.svg"
                        className="fill-current h-6 text-slate-800"
                    />
                    {
                    pop && <div className='absolute bg-white top-[101%] left-[-27%] p-1 rounded-md'>
                        <p className='text-slate-900'>Copied!</p>
                    </div>
                    }
                </button>
            </CopyToClipboard>
        </>
    )
}