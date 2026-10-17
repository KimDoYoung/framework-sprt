package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.sch.dto.Sch05RelateIcsAddReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch05RelateIcsRes;
import kr.co.kfs.asseterp.biz.sch.service.SchRelateIcsService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 연관 내부통제 (AS-IS Sch05_Page_RelateIcs → server/sch/Sch05_RelateIcs) — 체크리스트(E04)·상신 체크리스트 내용(sch)이 공유 */
@RestController
@RequestMapping("/api/v1/sch/relate-ics")
@RequiredArgsConstructor
public class SchRelateIcsController {

    private final SchRelateIcsService service;

    /** AS-IS sch.Sch05_RelateIcs.selectByInfoId */
    @GetMapping
    public ApiResponse<List<Sch05RelateIcsRes>> search(@RequestParam Long infoId) {
        return ApiResponse.ok(service.search(infoId));
    }

    /** AS-IS sch.Sch05_RelateIcs.modelUpdate → 넣은 행 */
    @PostMapping
    public ApiResponse<List<Sch05RelateIcsRes>> add(@RequestParam Long infoId, @RequestBody List<Sch05RelateIcsAddReq> items) {
        return ApiResponse.ok(service.add(infoId, items));
    }

    /** AS-IS sch.Sch05_RelateIcs.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> relateIcsIds) {
        return ApiResponse.ok(service.delete(relateIcsIds));
    }
}
