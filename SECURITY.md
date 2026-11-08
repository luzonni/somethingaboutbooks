# Segurança

Encontrou uma vulnerabilidade? Não abra uma issue pública. Use a aba **Security > Report a vulnerability**
do repositório para enviar um relato privado à equipe.

## Limites conhecidos

As contas ficam apenas no navegador (`localStorage`). A senha é guardada como hash PBKDF2, mas isso não substitui
uma autenticação em servidor: qualquer pessoa com acesso ao navegador consegue ler ou apagar os dados locais.
