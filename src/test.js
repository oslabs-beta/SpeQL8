const toParse = [{"path":["filmById"],"parentType":"Query","fieldName":"filmById","returnType":"Film","startOffset":23851567,"duration":27646998},{"path":["filmById","director"],"parentType":"Film","fieldName":"director","returnType":"String!","startOffset":51647158,"duration":83979},{"path":["filmById","releaseDate"],"parentType":"Film","fieldName":"releaseDate","returnType":"Date!","startOffset":51760978,"duration":15873},{"path":["filmById","title"],"parentType":"Film","fieldName":"title","returnType":"String!","startOffset":51846796,"duration":12601}]

for (let i = 0; i < toParse.length; i++) {
    console.log(toParse[i]);
}

