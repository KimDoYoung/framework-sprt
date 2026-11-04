package kr.co.kfs.asseterp.biz.batch.controller;

import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.dto.BatchRes;
import kr.co.kfs.asseterp.biz.batch.service.BatchService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 외부 cron용 배치 진입점 (AS-IS /BatchMain?actionCode=…). 인증은 JWT가 아니라 API key + IP 제한(BatchApiKeyFilter).
 * cron이 curl로 부르기 쉽게 GET·POST를 모두 받는다. 파라미터 이름은 AS-IS와 같다(companyId, worker, stdDate …).
 */
@RestController
@RequestMapping("/api/v1/batch")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @RequestMapping(value = "/{actionCode}", method = {RequestMethod.GET, RequestMethod.POST})
    public ApiResponse<BatchRes> run(@PathVariable String actionCode, @ModelAttribute BatchReq req) {
        BatchRes res = batchService.run(actionCode, req);
        return ApiResponse.ok(res.message(), res);
    }
}
