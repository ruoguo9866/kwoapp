import { useNavigate, useSearchParams } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import { Storage } from '@ruoguo/k-storage'
import styles from './index.module.less'
export default function Header({
    back,
    marginBottom = 45,
    style = { background: '#fff' },
    className,
    left,
    right,
    title,
    showBack = true
}) {
    const navigate = useNavigate()
    const [search] = useSearchParams()
    const titleName = title || search.get('title')

    const onBack = () => back ? back() : navigate(-1)
    const show = Storage.get('header')

    if (show == 0) return null

    return (
        <div style={{ marginBottom }}>
            <div className={styles.top}>
                <NavBar
                    onBack={onBack}
                    style={style}
                    backIcon={showBack}
                    className={className}
                    left={left}
                    right={right}
                >
                    {titleName}
                </NavBar>
            </div>
        </div>
    )
}