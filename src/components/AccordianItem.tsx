import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import InlineSVG from 'react-inlinesvg';

export const AccordianItem = ({open, toggle, title,path, description} : any) => {

    return (
        <>
            <div className="accordian-item pt-[10px] flex flex-col justify-center items-center w-full">
                <div className="accordian">
                    <div className="accordian-title flex justify-between items-center cursor-pointer" onClick={toggle}>
                        <div className="media flex items-center gap-2">
                            <InlineSVG
                                src={path}
                                className="icon fill-current text-camer h-12"
                                />
                            <h2>{title}</h2>
                        </div>
                        <div>{open ? "-" : "+"}</div>
                    </div>
                    <Collapse isOpened={open}>
                        <div className='accordian-desc'>
                            <textarea name="share-input" placeholder='Enter the text you want share...' className='share-input' />
                            {/* <input type="text"   /> */}
                        </div>
                    </Collapse>
                </div>
            </div>
        </>
    )
}