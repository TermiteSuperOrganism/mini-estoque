import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'node:console';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService){}

  async criar(dados: CreateProdutoDto) {
    const produtoExistente=await this.prisma.produto.findFirst({
      where: { nome: dados.nome}
    })
    if(produtoExistente){
      throw new ConflictException("Já existe um produto com este nome");
    }
    return this.prisma.produto.create({
      data: dados
    });
  }

  listarTodos() {
    return this.prisma.produto.findMany();
  }

  async buscarPorId(id: number) {
    const alvo= await this.prisma.produto.findUnique({
      where: {id}
    });
    if (alvo) return alvo;
    else throw new ConflictException("Não existe o produto com o id que procura");
  }

  async atualizar(id: number, dados: UpdateProdutoDto) {
    await this.buscarPorId(id);
    const nomeExiste=await this.prisma.produto.findFirst({
      where: { nome: dados.nome}
    })
    if(nomeExiste && nomeExiste.id!=id) throw new ConflictException("Nome já em uso por outro produto");
    return this.prisma.produto.update({
      where: {id},
      data: dados
    });
  }

  async deletar(id: number) {
    const alvo= await this.prisma.produto.findUnique({
      where: {id}
    });
    if (alvo) return this.prisma.produto.delete({
      where: {id}
    });
    else throw new ConflictException(`Não há um produto de ID ${id} para apagar.`);
  }
}
