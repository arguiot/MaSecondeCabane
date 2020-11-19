import { useTheme } from "@geist-ui/react"

export default function Skeleton({ display = true, ...props }) {
    const theme = useTheme()
    return (
    <div className="skeleton" {...props}>
        <style jsx>{`
        .skeleton {
            position: absolute;
            margin: var(--gaid-gap-unit);
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: calc(100% - 2 * var(--gaid-gap-unit));
            height: calc(100% - 2 * var(--gaid-gap-unit));
            background-image: linear-gradient(
            270deg,
            ${theme.palette.accents_1},
            ${theme.palette.accents_2},
            ${theme.palette.accents_2},
            ${theme.palette.accents_1}
            );
            background-size: 400% 100%;
            animation: loading 3s ease-in-out infinite;
            opacity: .5;
            transition: opacity 300ms ease-out;
            z-index: 100;
            display: ${display ? "block" : "none"};
        }
        @keyframes loading {
            0% {
            background-position: 200% 0;
            }
            to {
            background-position: -200% 0;
            }
        }
        `}</style>
    </div>)
}