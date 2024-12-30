import React, { createContext, useState, useEffect } from 'react';
import { Element } from '@craftjs/core';
import { Container } from '../components/container';
import { Child, Component } from '../components/child';
import { Link } from '../components/link';
import { Button } from '../components/button';
import { Svg } from '../components/svg';
import { Text } from '../components/text';
import { Image } from '../components/image';

const themes = [
    { name: 'Hyper UI', folder: 'hyperui' },
    { name: 'Tailblocks', folder: 'tailblocks' },
    { name: 'Flowrift', folder: 'flowrift' },
    { name: 'Meraki UI', folder: 'meraki-light' },
    { name: 'Preline', folder: 'preline' },
    { name: 'Flowbite', folder: 'flowbite' },
]

interface ComponentInterface {
    folder: string
    source: any
}

interface ComponentInterfaceFull extends ComponentInterface {
    displayName: string
    category: string
    source: string
    themeFolder: string
    blockFolder: string
}

interface ContextInterface {
    components: ComponentInterfaceFull[]
    categories: string[]
    themeNames: string[]
    themeIndex: number
    resolver: object
    updateIndex: (arg0: number) => void
}

const _resolver = {
    Container,
    Component,
    Element,
    Text,
    Child,
    Link,
    Button,
    Image,
    Svg,
}

const defaultValue = {
    components: [],
    categories: [],
    themeNames: [],
    themeIndex: 0,
    updateIndex: () => { },
    resolver: _resolver,
}

const ThemeContext = createContext<ContextInterface>(defaultValue)

type ProviderProps = { children: React.ReactNode }

const html = `
<section class="relative flex flex-wrap lg:h-screen lg:items-center">
  <div class="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
    <div class="mx-auto max-w-lg text-center">
      <h1 class="text-2xl font-bold sm:text-3xl">Get started today!</h1>

      <p class="mt-4 text-gray-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla
        eaque error neque ipsa culpa autem, at itaque nostrum!
      </p>
    </div>

    <form action="" class="mx-auto mt-8 mb-0 max-w-md space-y-4">
      <div>
        <label for="email" class="sr-only">Email</label>

        <div class="relative">
          <input
            type="email"
            class="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
            placeholder="Enter email"
          />

          <span class="absolute inset-y-0 right-4 inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </span>
        </div>
      </div>

      <div>
        <label for="password" class="sr-only">Password</label>
        <div class="relative">
          <input
            type="password"
            class="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
            placeholder="Enter password"
          />

          <span class="absolute inset-y-0 right-4 inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-500">
          No account?
          <a href="#" class="underline">Sign up</a>
        </p>

        <button
          type="submit"
          class="ml-3 inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
        >
          Sign in
        </button>
      </div>
    </form>
  </div>

  <div class="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
    <img
      alt="Welcome"
      src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
      class="inset-0 h-full w-full object-cover"
    />
  </div>
</section>
`

const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
    const [tab, setActiveTab] = useState<string>("Add Templates");
    const [themeIndex, setThemeIndex] = useState<number>(defaultValue.themeIndex)
    const [components, setComponents] = useState<ComponentInterfaceFull[]>(defaultValue.components)
    const [categories, setCategories] = useState<string[]>(defaultValue.categories)
    const [resolver, _setResolver] = useState<object>(defaultValue.resolver)

    const themeNames = themes.map((t) => t.name)

    useEffect(() => {
        updateIndex(0)
    }, [])

    const updateIndex = async (index: number) => {
        setThemeIndex(index)

        // set components
        const folder = themes[index].folder
        const url = "";//getThemeUrl(standaloneServer, folder)

        async function fetch(url) {
            return [{
                folder: "theme123",
                source: html
            }];
        }
        const data = await fetch(url);

        const _components = data.map((c: ComponentInterfaceFull) => ({
            displayName: c.folder.replace(/(\d)/, ' $1'),
            category: c.folder.replace(/\d/g, ''),
            source: c.source,
            themeFolder: folder,
            blockFolder: c.folder,
        })) as ComponentInterfaceFull[]

        // sort components
        const _coponentsSorted = _components.sort((a, b) => {
            return a.displayName.localeCompare(b.displayName, undefined, {
                numeric: true,
                sensitivity: 'base',
            })
        })
        setComponents(_coponentsSorted)

        // set categories
        const _categories = _components.map((c: ComponentInterfaceFull) => c.category)
        setCategories([...new Set(_categories)] as string[])
    }

    const value = {
        components,
        categories,
        resolver,
        themeNames,
        themeIndex,
        updateIndex,
        tab,
        setActiveTab
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export { ThemeContext, ThemeProvider }