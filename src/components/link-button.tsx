import { Link, LinkProps } from "expo-router";

type LinkButtonProps = LinkProps<string> & {
    title: string
}

export function LinkButton({
    title,
    href,
    ...rest
}: LinkButtonProps) {
    return (
        <Link
            href={href}
            className="text-slate-300 text-center text-base font-body"
            {...rest}
        >
            {title}
        </Link>
    )
}