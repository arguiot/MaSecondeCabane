import { Input, Tag, Spacer, Badge, Row } from "@geist-ui/react"
import { X } from '@geist-ui/react-icons'

export default function TagsInput({ value, onChange }) {
    const [input, setInput] = React.useState()
    const handler = e => {
        const v = e.target.value
        if ([",", ".", ";", " "].includes(v.slice(-1))) {
            let arr = Array.from(value)
            arr.push(v.substring(0, v.length - 1))
            onChange(arr)
            setInput("")
        } else {
            setInput(v)
        }
    }

    return <>
    <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    }}>
        {
            value.map((v, i) => <>
                <Tag type="secondary" invert style={{ margin: "3px" }}>
                    <Row>
                        { v } 
                        <X size={15} style={{ cursor: "pointer" }} onClick={() => {
                            let arr = Array.from(value)
                            arr.splice(i, 1)
                            onChange(arr)
                        }}/>
                    </Row>
                </Tag>
            </>)
        }
    </div>
    <Spacer y={.3} />
    <Input value={input} width="100%" onChange={handler} placeholder="Ajouter un tag" />
    </>
}