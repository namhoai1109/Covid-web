import { useEffect, useState } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import Wrapper, { MenuItem } from '../Popper';

function Menu({ menu, children }) {
    let [tab, setTab] = useState([{ data: menu }]);

    useEffect(() => {
        setTab([{ data: menu }]);
    }, [menu]);

    let tabCurr = tab[tab.length - 1];

    let renderItem = (attrs) => (
        <div tabIndex="-1" {...attrs}>
            <Wrapper>
                {tabCurr.data.map((item, index) => {
                    let isParent = !!item.child;
                    return (
                        <MenuItem
                            nohover={typeof(item.data) !== 'string'}
                            key={index}
                            data={item.data}
                            onClick={() => {
                                if (isParent) {
                                    setTab((prev) => [...prev, item.child]);
                                }
                            }}
                        />
                    );
                })}
            </Wrapper>
        </div>
    );

    let resetMenu = () => {
        setTab((prev) => prev.slice(0, 1));
    };
    return (
        <div>
            <TippyHeadless
                interactive
                offset={[0, 10]}
                placement="bottom-end"
                render={renderItem}
                onHide={resetMenu}
                trigger="click"
            >
                {children}
            </TippyHeadless>
        </div>
    );
}

export default Menu;
