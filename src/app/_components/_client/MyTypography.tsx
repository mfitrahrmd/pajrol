import { Typography, TypographyProps, styled } from '@mui/material'
import React, { PropsWithChildren } from 'react'

const TypographyStyled = styled(Typography, {
  name: 'MyTypography',
  slot: 'Root',
  label: 'MyTypography',
  shouldForwardProp: (propName) => true,
})<TypographyProps>(({ theme }) => ({
  'position': 'relative',
  '::before': {
    content: '""',
    position: 'absolute',
    display: 'block',
    width: '100%',
    height: '2px',
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    transform: 'scaleX(0)',
    transition: 'transform 0.25s ease-in-out',
  },
}))

export default function MyTypography<C extends React.ElementType>({
  children,
  ...props
}: PropsWithChildren<TypographyProps<C, { component?: C }>>) {
  return (
    <TypographyStyled {...props} className="MyTypography-root">
      {children}
    </TypographyStyled>
  )
}
