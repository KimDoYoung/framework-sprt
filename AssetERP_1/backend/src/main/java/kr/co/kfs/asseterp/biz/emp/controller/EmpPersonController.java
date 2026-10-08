package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.kfs.asseterp.biz.emp.dto.PersonSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpPersonService;

/** 기본정보 탭 (AS-IS Emp01_TabPage_Person → server/emp/Emp01_Person) */
@RestController
@RequestMapping("/api/v1/emp/persons")
@RequiredArgsConstructor
public class EmpPersonController {

    private final EmpPersonService empPersonService;

    /** AS-IS emp.Emp01_Person.update */
    @PutMapping("/{personId}")
    public ApiResponse<Void> updatePerson(@AuthenticationPrincipal UserPrincipal principal,
                                          @PathVariable Long personId,
                                          @RequestBody PersonSaveReq req) {
        empPersonService.updatePerson(principal, personId, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp04_AddTitle.selectByPersonId → 건수 */
    @GetMapping("/{personId}/add-titles/count")
    public ApiResponse<Integer> countAddTitles(@PathVariable Long personId) {
        return ApiResponse.ok(empPersonService.countAddTitles(personId));
    }

    /** AS-IS emp.Emp01_Person.deleteTarget */
    @DeleteMapping("/{personId}")
    public ApiResponse<Void> deletePerson(@AuthenticationPrincipal UserPrincipal principal,
                                          @PathVariable Long personId) {
        empPersonService.deletePerson(principal, personId);
        return ApiResponse.ok(null);
    }
}
