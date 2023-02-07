import { PropsWithChildren } from 'react';
import {
  chakra,
  HTMLChakraProps,
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { HTMLMotionProps, motion } from 'framer-motion';
import { HamburgerIcon } from '@chakra-ui/icons';
import ThemeToggleButton from './ThemeToggleButton';

interface LinkItemProps {}

const LinkItem = ({ children }: PropsWithChildren<LinkItemProps>) => {
  // const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900');
  return (
    <Link
      p={2}
      // bg={active ? 'glassTeal' : undefined}
      // color={active ? '#202023' : inactiveColor}>
      color={'#202023'}>
      {children}
    </Link>
  );
};

// type Merge<P, T> = Omit<P, keyof T> & T;
// export type NavbarProps = Merge<HTMLChakraProps<'div'>, HTMLMotionProps<'div'>>;

function Navbar(props: any) {
  return (
    <Box
      position='fixed'
      as='nav'
      w='100%'
      bg={useColorModeValue('#ffffff40', '#20202380')}
      css={{ backdropFilter: 'blur(10px)' }}
      zIndex={2}
      {...props}>
      <Container
        display='flex'
        p={2}
        maxW='container.md'
        flexWrap='wrap'
        alignItems={'center'}
        justifyContent='space-between'>
        <Flex align='center' mr={5}>
          <Heading as='h2' size='md' letterSpacing={'tighter'}>
            Phaser3 공식 튜토리얼 코스 게임
          </Heading>
        </Flex>

        {/* <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems='center'
          flexGrow={1}
          mt={{ base: 4, md: 0 }}></Stack> */}

        <Box alignItems='right'>
          <ThemeToggleButton />
        </Box>
      </Container>
    </Box>
  );
}

export default Navbar;
