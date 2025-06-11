import { motion, type Variants } from 'motion/react'
import type { Suit as TSuit } from '../types/utils'
import { Suit } from './Suit'

export const Loading = () => {
  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className="flex grow items-center justify-center gap-2"
    >
      <Item suit="heart" />
      <Item suit="spade" />
      <Item suit="club" />
      <Item suit="diamond" />
    </motion.div>
  )
}

const Item = ({ suit }: { suit: TSuit }) => {
  const variants: Variants = {
    jump: {
      y: -20,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    },
  }

  return (
    <motion.div variants={variants} className="w-8">
      <Suit variant={suit} size="lg" face classname="shrink-0" />
    </motion.div>
  )
}
