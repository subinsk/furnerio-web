import PropTypes from "prop-types";
// utils
import "@/utils/highlight";
import ReactMarkdown from "react-markdown";
// markdown plugins
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// @mui
import Link from "@mui/material/Link";
// routes
import { RouterLink } from "@/routes/components";
//
import Image from "../image";
//
import StyledMarkdown from "./styles";

// ----------------------------------------------------------------------

export default function Markdown({
  sx,
  ...other
}: {
  sx?: any;
  [x: string]: any;
}) {
  return (
    <StyledMarkdown sx={sx}>
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          rehypeHighlight,
          [remarkGfm, { singleTilde: false }],
        ]}
        components={components}
        {...other}
      />
    </StyledMarkdown>
  );
}

Markdown.propTypes = {
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------

const components = {
  img: ({ ...props }: { [x: string]: any }) => (
    <Image alt={props.alt} ratio="16/9" sx={{ borderRadius: 2 }} {...props} />
  ),
  a: ({ ...props }) => {
    const isHttp = props.href.includes("http");

    return isHttp ? (
      <Link target="_blank" rel="noopener" {...props} />
    ) : (
      <Link component={RouterLink} href={props.href} {...props}>
        {props.children}
      </Link>
    );
  },
};
