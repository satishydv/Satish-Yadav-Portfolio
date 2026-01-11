'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button, Flex, Text, Heading, Badge, Link } from '@radix-ui/themes';
import { Bricolage } from '@/utils/fonts';
import { cn } from '@/lib/utils';

interface ProjectModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    Title: string;
    Desc: string;
    Skills: string[];
    SrcLink: string;
    WebLink: string;
}

export const ProjectModal = ({
    isOpen,
    setIsOpen,
    Title,
    Desc,
    Skills,
    SrcLink,
    WebLink,
}: ProjectModalProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className={cn(
                    "fixed top-[50%] left-[50%] z-[101] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%] rounded-[2rem] border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl focus:outline-none dark:bg-zinc-900/90 dark:border-zinc-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                    Bricolage
                )}>
                    <Flex direction="column" gap="4">
                        <Flex justify="between" align="center">
                            <Dialog.Title asChild>
                                <Heading size="6" className="text-zinc-900 dark:text-white">
                                    {Title}
                                </Heading>
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                                    aria-label="Close"
                                >
                                    <Cross2Icon width={20} height={20} />
                                </button>
                            </Dialog.Close>
                        </Flex>

                        <Dialog.Description asChild>
                            <Text size="3" className="leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {Desc}
                            </Text>
                        </Dialog.Description>

                        <Flex gap="2" wrap="wrap" className="mt-2">
                            {Skills.map((skill) => (
                                <Badge key={skill} variant="soft" color="indigo" size="2">
                                    {skill}
                                </Badge>
                            ))}
                        </Flex>

                        <Flex gap="3" mt="6" justify="end" className="w-full">
                            <Link href={SrcLink} target="_blank" underline="none">
                                <Button variant="outline" size="3" className="cursor-pointer">
                                    View Source
                                </Button>
                            </Link>
                            <Link href={WebLink} target="_blank" underline="none">
                                <Button variant="solid" size="3" color="iris" className="cursor-pointer">
                                    Live Demo
                                </Button>
                            </Link>
                        </Flex>
                    </Flex>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
