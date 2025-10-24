# Term Suggestion 

## Description

Implement an interface with an algorithm that takes a term as input and returns, from a list of lowercase alphanumeric terms, those that either contain the term or are the closest matches to it.

The algorithm should return **N suggestions**.  
In case of ties in the number of differences, prefer terms whose lengths are closest to the searched term, then sort them alphabetically.

Similarity is determined by the **number of letter replacements** needed to transform one term into another (insertions are not considered).  
The fewer replacements required, the more similar the term.

### Example

If we search for 2 similar terms to `gros` in the list:

```typescript
gros
[gros, gras, graisse, agressif, go, ros, gro]
```

Then we get:
| Term       | Differences | Comment                   |
| ---------- | ----------- | ------------------------- |
| `gros`     | 0           | exact match               |
| `gras`     | 1           | close match               |
| `graisse`  | 2           | less similar              |
| `agressif` | 1           | same difference as `gras` |
| `go`       | —           | too short                 |
| `ros`      | —           | too short                 |
| `gro`      | —           | too short                 |

Output:
```ts
[gros, gras]
```
(gras is chosen over agressif because it’s shorter.)



## Run
I am using [Bun](https://bun.com/) for this project so I recommend you to take a look [here](https://bun.com/docs/installation) to install it first if you don't have. If you already install it, you can follow next step:

Install dependencies:

```bash
bun install
```

Run with a sample here if you want to test it quickly:
- Words: gros, gras, graisse, agressif, go, ros, gro
- Term: gros

```bash
bun run index.ts
```

## TODO

- Add new algorithm to calculate distance
- Enhance CLI to support choosing new algorithm