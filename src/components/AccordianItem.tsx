import React from 'react';
import { Collapse } from 'react-collapse';
import InlineSVG from 'react-inlinesvg';

interface AccordianItemProps {
    open: boolean;
    toggle: () => void;
    title: string;
    path: string;
    message: string;
    enabled: boolean;
    onCheckboxChange: () => void;
    setMessage: (text: string) => void;
}

export const AccordianItem = ({ open, toggle, title, path, message, enabled, setMessage, onCheckboxChange }: AccordianItemProps) => {

    const handleTitleClick = () => {
        toggle();
        onCheckboxChange();
    };

    return (
        <>
            <div className="accordian-item pt-[10px] flex flex-col justify-center items-center w-full">
                <div className="accordian">
                    <div className="accordian-title flex justify-between items-center cursor-pointer" onClick={handleTitleClick}>
                        <div className="select-leader flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="media" 
                                value={title} 
                                checked={enabled}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    onCheckboxChange();
                                }}
                            />
                            <div className="media flex items-center gap-2 p-2">
                                <InlineSVG
                                    src={path}
                                    className="icon fill-current text-camer h-12"
                                />
                                <h2>{title}</h2>
                            </div>
                        </div>
                        <div>
                            <div>{open ? "-" : "+"}</div>
                        </div>
                    </div>
                    <Collapse isOpened={open}>
                        <div className='accordian-desc'>
                            <textarea 
                                name="share-input" 
                                placeholder='Enter the text you want share...' 
                                className='share-input' 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </Collapse>
                </div>
            </div>
        </>
    )
}
