import type React from "react"

const Index: React.FC = () => {
  return (
    <section className="span-max-w-4 md:span-max-w-8 xl:span-max-w-12 mx-auto pt-span-12">
      <h1 className="text-4xl font-bold">Sizes</h1>
      <Sizes />
      <h1 className="text-4xl font-bold mt-span-12">Flex</h1>
      <Flex />
      <h1 className="text-4xl font-bold mt-span-12">Wrap</h1>
      <Wrap />
    </section>
  )
}

export default Index

const Sizes: React.FC = () => {
  return (
    <div className="flex flex-col gap-base-2 md:gap-base-3 xl:gap-base-4 my-4">
      <div className="bg-red-500 span-w-4 md:span-w-8 xl:span-w-12">
        Width Full
      </div>
      <div className="bg-red-500 span-w-2 md:span-w-4 xl:span-w-6">
        Width : 1/2
      </div>
    </div>
  )
}

const Flex: React.FC = () => {
  return (
    <>
      <div className="flex gap-base-2 md:gap-base-3 xl:gap-base-4 my-4">
        <div className="bg-red-500 span-w-6 xl:span-w-9">Width 9</div>
        <div className="bg-red-500 span-w-2 xl:span-w-3">Width 3</div>
      </div>
      <div className="flex gap-base-2 md:gap-base-3 xl:gap-base-4 my-4">
        <div className="bg-red-500 span-w-4 xl:span-w-6">Width 6</div>
        <div className="bg-red-500 span-w-4 xl:span-w-6">Width 6</div>
      </div>
      <div className="flex gap-base-2 md:gap-base-3 xl:gap-base-4 my-4 justify-center flex-wrap">
        <div className="bg-red-500 span-w-2 xl:span-w-4">Width 4</div>
        <div className="bg-red-500 span-w-2 xl:span-w-4">Width 4</div>
        <div className="bg-red-500 span-w-2 xl:span-w-4">Width 4</div>
      </div>
      <div className="flex gap-base-2 md:gap-base-3 xl:gap-base-4 my-4">
        <div className="bg-red-500 span-w-2 xl:span-w-3">Width 3</div>
        <div className="bg-red-500 span-w-2 xl:span-w-3">Width 3</div>
        <div className="bg-red-500 span-w-2 xl:span-w-3">Width 3</div>
        <div className="bg-red-500 span-w-2 xl:span-w-3">Width 3</div>
      </div>
    </>
  )
}
const Wrap: React.FC = () => {
  return (
    <>
      <div className="flex gap-base-2 md:gap-base-3 xl:gap-base-4 my-4 flex-wrap">
        <div className="bg-red-500 span-min-w-3 span-w-4 xl:span-w-3">
          Width 3
        </div>
        <div className="bg-red-500 span-min-w-3 span-w-4 xl:span-w-3">
          Width 3
        </div>
        <div className="bg-red-500 span-min-w-3 span-w-4 xl:span-w-3">
          Width 3
        </div>
        <div className="bg-red-500 span-min-w-3 span-w-4 xl:span-w-3">
          Width 3
        </div>
      </div>
    </>
  )
}
