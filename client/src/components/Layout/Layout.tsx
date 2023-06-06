import { Container } from "@chakra-ui/react";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <main>
      <Container maxW="max">
        {children}
      </Container>
    </main>
  )
}