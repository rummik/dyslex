import React, { useState, useMemo, Children } from 'react'
import { useInterval, useTimeout } from 'usehooks-ts'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import styles from '../styles/Dyslex.module.css'

type DyslexProps = {
  text: string
}

// list of similar lower case characters to be replaced
const SimilarCharacters: { [key: string]: string[] } = {
  a: ['e', 'o'],
  e: ['a', 'o'],
  b: ['p', 'q', 'd'],
  d: ['b', 'q', 'p'],
  p: ['b', 'q', 'd'],
  q: ['b', 'p', 'd'],
  c: ['o'],
  o: ['c'],
  m: ['w'],
  w: ['m'],
  s: ['z'],
  z: ['s'],
  h: ['u', 'n'],
  n: ['h', 'u'],
  u: ['h', 'n'],
  k: ['x', 'y'],
  x: ['k', 'y'],
  y: ['k', 'x'],
  B: ['R', 'P'],
  C: ['B', 'D', 'G', 'O', 'Q', 'U'],
  D: ['O', 'Q'],
  G: ['B', 'C', 'D', 'O', 'Q', 'U'],
  O: ['B', 'C', 'D', 'G', 'Q', 'U'],
  Q: ['B', 'C', 'D', 'G', 'O', 'U'],
  U: ['B', 'C', 'D', 'G', 'O', 'Q'],
  I: ['J', 'L'],
  J: ['I', 'L'],
  L: ['I', 'J'],
  i: ['j', 'l'],
  j: ['i', 'l'],
  l: ['i', 'j'],
}

const DyslexGroup = ({ children, ...props }: { children: string }) => (
  <span {...props}>{children}</span>
)

const DyslexChar: React.FC<{ char: string }> = ({ char }) => {
  const [index, setIndex] = useState<number>(0)
  const similarChars = useMemo(() => [char, ...(SimilarCharacters[char] || [])], [char])

  const randomIndex = () =>
    setIndex(Math.floor(Math.random() * similarChars.length))

  useInterval(randomIndex, Math.random() * (600) + 150)

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        position: 'relative',
        filter: similarChars.length ? 'blur(0.02em)' : '',
      }}
    >
      <span
        style={{
          opacity: similarChars.length ? 0.5 : 1,
        }}
      >
        {char}
      </span>
      <TransitionGroup component={null}>
        {similarChars.map((c, i) => (
          <CSSTransition
            key={i}
            in={i === index}
            appear={true}
            timeout={500}
            className={i === index ? styles.primary : styles.secondary}
            classNames={{ ...styles }}
          >
            <span>{c}</span>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </span>
  )
}

const DyslexWord: React.FC<DyslexProps> = ({
  text,
}) => {
  const chars = useMemo<JSX.Element[]>(() => {
    return text.split('').map((value, index) => (
      <DyslexChar
        char={value}
        key={index}
      />
    ))
  }, [text])

  return <span style={{ display: 'inline-block' }}>{chars}</span>
}

const Dyslex: React.FC<DyslexProps> = ({
  text,
}) => {
  const words = useMemo<JSX.Element[]>(() => {
    return text.split(' ').map((word, index, words) => {
      return (
        <span key={index}>
          <DyslexWord
            text={word}
          />
          {words[index + 1] ? ' ' : ''}
        </span>
      )
    })
  }, [text])

  return <span>{words}</span>
}

export default Dyslex
