package kr.co.kfs.asseterp.biz.sch.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassComboRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassSaveReq;
import kr.co.kfs.asseterp.biz.sch.service.SchClassService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 스케줄분류 (AS-IS Sch08_Lookup_Class → server/sch/Sch08_Class, 콤보 Sys00_Common.selectScheduleClass) */
@RestController
@RequestMapping("/api/v1/sch/classes")
@RequiredArgsConstructor
public class SchClassController {

    private final SchClassService service;

    /** AS-IS sch.Sch08_Class.selectByPersonId */
    @GetMapping
    public ApiResponse<List<Sch08ClassRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS sys.Sys00_Common.selectScheduleClass — 분류 콤보 (ipoYn이면 selectScheduleClass2: 공모주 포함) */
    @GetMapping("/combo")
    public ApiResponse<List<Sch08ClassComboRes>> combo(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(defaultValue = "false") boolean ipoYn) {
        return ApiResponse.ok(ipoYn ? service.comboWithIpo(principal) : service.combo(principal));
    }

    /** AS-IS sch.Sch08_Class.checkClassId — 쓰는 일정이 있으면 오류 */
    @GetMapping("/{classId}/check-delete")
    public ApiResponse<Void> checkDelete(@PathVariable Long classId) {
        service.checkDelete(classId);
        return ApiResponse.ok(null);
    }

    /** AS-IS sch.Sch08_Class.update → 저장한 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<Sch08ClassRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Sch08ClassSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS sch.Sch08_Class.delete → 지운 수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> classIds) {
        return ApiResponse.ok(service.delete(principal, classIds));
    }
}
