# Portal do cliente + Painel administrativo

| Página | Para quem | O que tem |
| --- | --- | --- |
| `/entrar` | Todos | Login, primeiro acesso (criar senha) e "esqueci a senha" |
| `/portal` | Cliente | Andamento da LLC, pendências, dados da empresa, atualizações, documentos (baixar e enviar), obrigações fiscais/contábeis com datas e tutoriais de bancos e gateways |
| `/admin` | Eduardo | Indicadores, prazos dos próximos 60 dias (Annual Report e renovação), pendências abertas e lista de clientes com busca e filtro |
| `/admin/<id>` | Eduardo | Etapas (clique para marcar), dados da empresa, notas internas, documentos, pendências, atualizações para o cliente e cofre de acessos |

Sem o Supabase conectado, tudo roda em **modo demonstração** com dados fictícios.

## Como ligar de verdade (uma vez só)

1. Crie um projeto em [supabase.com](https://supabase.com) (plano gratuito serve para começar).
2. No Supabase, abra **SQL Editor**, cole todo o conteúdo de `supabase/migrations/0001_portal_cliente.sql` e clique em **Run**.
3. Em **Authentication > URL Configuration**:
   - Site URL: `https://destravausa.com`
   - Redirect URLs: `https://destravausa.com/portal` e `https://destravausa.com/entrar`
4. Em **Authentication > Sign In / Providers > Email**, deixe **Confirm email** ligado (impede que alguém crie conta com o e-mail de outra pessoa).
5. Em **Project Settings > API**, copie a **Project URL** e a **anon / publishable key** e configure no site:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = anon key
6. Entre em `/entrar`, clique em **Primeiro acesso** e crie a sua conta. Depois, no SQL Editor, rode (trocando pelo seu e-mail):

   ```sql
   update public.profiles set role = 'admin' where email = 'seu-email@exemplo.com';
   ```

7. Saia e entre de novo: você cai direto no `/admin`.

## Dia a dia

- **Novo cliente:** no `/admin`, clique em **Novo cliente** com o e-mail que ele vai usar. Mande para ele: "Acesse destravausa.com/entrar, clique em Primeiro acesso e crie sua senha com este e-mail."
- **Etapas:** marque cada etapa concluída. Aparece um botão **Avisar cliente**, que publica a novidade no portal dele.
- **Documentos:** escolha a categoria e envie. Use **Só para mim** para arquivos que o cliente não deve ver.
- **Pendências:** "Cliente" aparece em destaque no portal dele; "Destrava USA" é a sua lista de tarefas.
- **Acessos:** no primeiro uso, crie uma **senha mestra**. As senhas dos clientes são criptografadas no navegador com ela. **Se esquecer a senha mestra, não há como recuperar os acessos salvos.**
- **Prazos:** preencha "Vencimento do Annual Report" e "Vencimento da renovação anual" de cada cliente para aparecerem no painel.

## Segurança

- Cada cliente só enxerga a própria empresa (regras de RLS no banco).
- Arquivos ficam num bucket privado e abrem por link temporário de 5 minutos.
- Cofre de acessos e notas internas: só o admin vê.
