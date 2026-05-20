---
title: Math Typesetting with KaTeX
date: 2026-05-20 13:00:00
categories: [Development]
tags: [math, katex, latex]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: "Inline and display math rendered at build time by KaTeX — zero runtime JavaScript, crisp at any resolution. Covers inline expressions, display blocks, aligned systems, series, matrices, and more."
---

KaTeX renders LaTeX math to HTML at build time. There is no JavaScript on the page — the equations are fully baked into the static HTML at `hexo generate` time. The only runtime asset is the KaTeX CSS file for fonts and layout.

## Inline math

Wrap an expression in `$...$` to render it inline with the surrounding text.

Einstein's mass-energy equivalence, $E = mc^2$, is one of the most recognised equations in physics. The Pythagorean theorem states that $a^2 + b^2 = c^2$ for a right-angled triangle with legs $a$, $b$ and hypotenuse $c$.

The quadratic formula solves $ax^2 + bx + c = 0$ for any real $a \neq 0$:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

## Display blocks

Wrap a standalone expression in `$$...$$` to render it centred on its own line.

The Gaussian integral appears throughout probability and physics:

$$\int_{-\infty}^{\infty} e^{-x^2}\, dx = \sqrt{\pi}$$

Euler's identity connects the five most important constants in mathematics:

$$e^{i\pi} + 1 = 0$$

## Sums and products

The Basel problem, solved by Euler in 1734:

$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

The definition of $e$ as a limit:

$$e = \lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = \sum_{k=0}^{\infty} \frac{1}{k!}$$

## Aligned systems

Use `\begin{aligned}` for multi-line derivations with vertically aligned equals signs.

Polar to Cartesian conversion:

$$\begin{aligned}
x &= r\cos\theta \\
y &= r\sin\theta \\
r &= \sqrt{x^2 + y^2}
\end{aligned}$$

The Cauchy–Riemann equations for a holomorphic function $f = u + iv$:

$$\begin{aligned}
\frac{\partial u}{\partial x} &= \frac{\partial v}{\partial y} \\[4pt]
\frac{\partial u}{\partial y} &= -\frac{\partial v}{\partial x}
\end{aligned}$$

## Matrices

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}$$

The identity and rotation matrices in $\mathbb{R}^2$:

$$I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}, \qquad R_\theta = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$$

## Calculus

The fundamental theorem:

$$\int_a^b f'(x)\, dx = f(b) - f(a)$$

Taylor series for $\sin x$ around $x = 0$:

$$\sin x = \sum_{n=0}^{\infty} \frac{(-1)^n}{(2n+1)!} x^{2n+1} = x - \frac{x^3}{6} + \frac{x^5}{120} - \cdots$$

## Probability

Bayes' theorem, the cornerstone of probabilistic inference:

$$P(A \mid B) = \frac{P(B \mid A)\, P(A)}{P(B)}$$

The normal distribution's probability density function with mean $\mu$ and standard deviation $\sigma$:

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$$

---

Math inside a code block is **not** rendered — it stays as literal source:

```text
$E = mc^2$   ← this stays as text
$$\int f\,dx$$ ← this too
```

## Avoiding false positives

The `$...$` delimiter matches any two dollar signs on the same line, so prose containing currency can trigger the renderer unintentionally. For example, writing "costs $50 and saves $30" would render "50 and saves" as a math expression.

To avoid this, either escape the dollar sign with a backslash (`\$50`) or rephrase to keep dollar signs on separate lines. Display blocks (`$$...$$`) are less prone to false positives since they require a blank line around them in most contexts.
