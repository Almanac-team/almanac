import {createContext, type ReactElement, type ReactNode, useCallback, useContext, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {type RefObject} from "preact/compat";
import clsx from "clsx";

interface MenuContextValue {
    open: boolean;
    handler?: (open: boolean) => unknown;
    handlerRef?: RefObject<HTMLDivElement>;
}

const MenuContext = createContext<MenuContextValue>({open: false, handler: undefined, handlerRef: undefined});

export function MenuHandler({children}: { children: ReactNode }) {
    const {open, handler, handlerRef} = useContext(MenuContext);
    return <div className="h-fit w-fit" ref={handlerRef} onClick={() => handler ? handler(!open) : null}>
            {children}
        </div>

}

export function MenuBody({children}: { children: ReactNode }) {
    const {open, handler, handlerRef} = useContext(MenuContext);
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    const close = useCallback((e: MouseEvent) => {
        if (e.target === null) return;

        if (!ref?.current?.contains(e.target as Node) && !handlerRef?.current?.contains(e.target as Node)) {
            handler ? handler(false): null
        }
    }, [ref, handlerRef, handler]);

    useEffect(() => {
        if (open) {
            addEventListener("click", close);
            return () => {
                removeEventListener("click", close)
            }
        }
    }, [open, close]);

    useEffect(() => {
        if (open) {
            const animation = setTimeout(() => {
                setVisible(true);
            }, 50)

            return () => {
                setVisible(true);
                clearTimeout(animation);
            }
        } else {
            const animation = setTimeout(() => {
                setVisible(false);
            }, 300)

            return () => {
                setVisible(false);
                clearTimeout(animation);
            }
        }
    }, [open])


    if (!visible && !open) {
        return null;
    }

    const {top, left, width, height} = handlerRef?.current?.getBoundingClientRect() ?? {top: 0, left: 0, width: 0, height: 0};
    const leftPos = left - ((ref?.current?.clientWidth ?? 0) - width) / 2;
    let topPos = top + height + 10;
    if (topPos + (ref?.current?.clientHeight ?? 0) > window.innerHeight) {
        topPos = top - (ref?.current?.clientHeight ?? 0) - 10;
    }

    return createPortal(
        <div ref={ref}
             className={clsx('absolute bg-white p-2 rounded-md outline outline-gray-300 transition-opacity ease-in-out duration-150', open && visible ? "opacity-100" : "opacity-0")}
             style={{top: topPos, left: leftPos}}
        >
            {children}
        </div>,
        document.body
    );
}


export function Menu({children, open, handler}: {
    children: ReactElement<typeof MenuHandler> | ReactElement<typeof MenuBody>[],
    open?: boolean,
    handler?: (open: boolean) => unknown
}) {
    const handlerRef = useRef<HTMLDivElement>(null);

    return <MenuContext.Provider value={{open: open ?? false, handler, handlerRef}}>
        {children}
    </MenuContext.Provider>
}