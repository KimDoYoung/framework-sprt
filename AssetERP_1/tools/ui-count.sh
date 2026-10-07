#!/usr/bin/env bash
# 06 항목 10 UI 대조표의 AS-IS 쪽: 색인 화면 파일에서 클래스마다 이벤트·버튼·그리드 수를 센다 (03 원칙 12).
# 사용: tools/ui-count.sh docs/as-is/src/sys/screens/Sys01_Tab_Company.md
# 이벤트는 [E..] 줄과 └ [E..] 하위 줄, 버튼은 "사용된 버튼들" 번호 줄, 그리드는 "- 그리드 `" 줄을 센다.
set -euo pipefail
awk '/^### /{c=$2; gsub(/[()`]/,"",c); order[++n]=c}
     /^\[E[0-9]+\]/ || /^ +└ \[E[0-9]+\]/ {ev[c]++}
     /^[0-9]+\. <Button/ {bt[c]++}
     /^- 그리드 `/ {gr[c]++}
     END{printf "| 클래스 | 버튼 | 이벤트 | 그리드 |\n|:---|---:|---:|---:|\n";
         for(i=1;i<=n;i++){k=order[i]; printf "| %s | %d | %d | %d |\n",k,bt[k],ev[k],gr[k]; tb+=bt[k]; te+=ev[k]; tg+=gr[k]}
         printf "| 합계 | %d | %d | %d |\n",tb,te,tg}' "$1"
