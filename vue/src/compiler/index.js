/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {

  // 1. 解析： 将template转化为ast, js对象
  const ast = parse(template.trim(), options)

  // 2. 优化： 标记静态节点， diff时直接跳过
  if (options.optimize !== false) {
    optimize(ast, options)
  }

  // 3. 代码生成： 转换ast 为代码字符串
  const code = generate(ast, options)

  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
  
})
