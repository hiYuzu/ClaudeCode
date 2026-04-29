# ComfyUI + 本地 FHDR_ComfyUI-Q4_K_M.GGUF

---

## Workflow

```
CLIP Loader ──┬──► CLIP Text Encoder (Positive)
              │                 │
              ▼                 │
CLIP Text Encoder (Negative) ───┤
                                │
                                │
                                │
 Empty Latent Image ────────────┤
                                ▼
 Unet Loader (GGUF) ──────► K Sampler ◄── VAE Loader
                                │
                                ▼
                          VAE Decoder ──► Save Image
```

---

## 配置详情

| 序号 | 节点 | 参数 | 值 |
|:---:|------|------|-----|
| 1 | **CLIP Loader** | name | `clip_l.safetensors/model.safetensors` |
| | | type | `sd3` |
| | | device | `default` |
| 2 | **CLIP Text Encoder 1** | text | `Positive Text` |
| 3 | **CLIP Text Encoder 2** | text | `Negative Text` |
| 4 | **Unet Loader (GGUF)** | model | `FHDR_ComfyUI-Q4_K_M.GGUF` |
| 5 | **Empty Latent Image** | width | `1024` |
| | | height | `1024` |
| | | batch | `1` |
| 6 | **K Sampler** | seed | `random` |
| | | 生成后控制 | `randomize` |
| | | steps | `45` |
| | | cfg | `7.0` |
| | | sampler name | `dpmpp_2m` |
| | | 调度器 | `normal` |
| | | 降噪 | `1.00` |
| 7 | **VAE Loader** | name | `diffusion_pytorch_model.safetensors` |
| 8 | **VAE Decoder** | - | - |
| 9 | **Save Image** | - | - |

---

> **提示**: 使用前请确保所有模型文件已正确放置在对应路径
