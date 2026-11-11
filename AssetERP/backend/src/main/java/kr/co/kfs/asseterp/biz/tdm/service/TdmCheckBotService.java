package kr.co.kfs.asseterp.biz.tdm.service;

import org.springframework.stereotype.Service;

import kr.co.kfs.asseterp.biz.tdm.dto.CheckBotCmntReq;
import kr.co.kfs.asseterp.common.bot.BotClient;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/** AS-IS server/tdm/Tdm52_ChckManl.getBotCheckCmnt L557-593 — AI 점검의견 작성 (DB를 읽거나 쓰지 않는다) */
@Service
@RequiredArgsConstructor
public class TdmCheckBotService {

    private final BotClient botClient;

    public String getBotCheckCmnt(CheckBotCmntReq req) {
        // 원본 문구 그대로(원본 2026-10-30에 "점점항목" 오타를 "점검항목"으로 고침), null은 원본처럼 "null" 글자로 이어 붙는다
        String taskType = "책무구조이행점검";
        String userPrompt = "[점검항목]: " + req.checkItem() + "\n"
                + "[점검방법]: " + req.checkHow() + "\n"
                + "[검토결과]: " + req.checkResultName();
        BotClient.BotResult r = botClient.call(userPrompt, taskType);
        if (!r.ok()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "ai 점검의견 작성실패 - " + r.errorMsg());
        }
        return r.content();
    }
}
