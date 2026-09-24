import { Fragment } from 'react'

type Block =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'hr' }
  | { type: 'p'; text: string }

function parse(content: string): Block[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let paragraph: string[] = []
  let list: string[] | null = null

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ').trim() })
      paragraph = []
    }
  }
  const flushList = () => {
    if (list && list.length) {
      blocks.push({ type: 'ul', items: list })
    }
    list = null
  }

  for (const raw of lines) {
    const line = raw.trim()

    if (line === '') {
      flushParagraph()
      flushList()
      continue
    }
    if (line === '---') {
      flushParagraph()
      flushList()
      blocks.push({ type: 'hr' })
      continue
    }
    if (line.startsWith('### ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'h3', text: line.slice(4) })
      continue
    }
    if (line.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'h2', text: line.slice(3) })
      continue
    }
    if (line.startsWith('> ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'quote', text: line.slice(2) })
      continue
    }
    if (line.startsWith('- ')) {
      flushParagraph()
      if (!list) list = []
      list.push(line.slice(2))
      continue
    }

    // regular text -> accumulate into current paragraph
    flushList()
    paragraph.push(line)
  }
  flushParagraph()
  flushList()
  return blocks
}

/** Minimal, dependency-free renderer for the article body. Produces clean, readable typography. */
export function ArticleContent({ content }: { content: string }) {
  const blocks = parse(content)

  return (
    <div className="space-y-6 font-serif text-xl leading-9 text-foreground/90">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return (
              <h2 key={i} className="pt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {b.text}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i} className="pt-2 text-xl font-semibold tracking-tight text-foreground">
                {b.text}
              </h3>
            )
          case 'quote':
            return (
              <blockquote
                key={i}
                className="rounded-r-xl border-l-4 border-amber-400 bg-gradient-to-r from-amber-100/50 to-transparent py-3 pl-5 pr-4 text-lg font-medium italic text-foreground dark:from-amber-900/20"
              >
                {b.text}
              </blockquote>
            )
          case 'ul':
            return (
              <ul key={i} className="ml-1 space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-cyan-600" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )
          case 'hr':
            return <hr key={i} className="mx-auto w-24 border-t-2 border-dashed border-border" />
          case 'p':
            return (
              <p key={i} className="first-of-type:first-letter:float-left first-of-type:first-letter:mr-2 first-of-type:first-letter:text-5xl first-of-type:first-letter:font-bold first-of-type:first-letter:leading-none first-of-type:first-letter:text-transparent first-of-type:first-letter:bg-clip-text first-of-type:first-letter:bg-gradient-to-br first-of-type:first-letter:from-amber-500 first-of-type:first-letter:to-cyan-600">
                {b.text}
              </p>
            )
          default:
            return <Fragment key={i} />
        }
      })}
    </div>
  )
}
