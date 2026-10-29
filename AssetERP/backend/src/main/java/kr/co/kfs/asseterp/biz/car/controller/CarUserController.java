package kr.co.kfs.asseterp.biz.car.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarUserRes;
import kr.co.kfs.asseterp.biz.car.dto.CarUserSaveReq;
import kr.co.kfs.asseterp.biz.car.service.CarUserService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 전용차량 사용자관리 (AS-IS Car02_Grid_User → server/car/Car02_User) */
@RestController
@RequestMapping("/api/v1/car/users")
@RequiredArgsConstructor
public class CarUserController {

    private final CarUserService service;

    /** AS-IS car.Car02_User.selectByInfoId */
    @GetMapping
    public ApiResponse<List<CarUserRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long infoId) {
        return ApiResponse.ok(service.search(principal, infoId));
    }

    /** AS-IS car.Car02_User.update → 저장된 행(요청 순서). 새 행은 userId가 null */
    @PutMapping
    public ApiResponse<List<CarUserRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CarUserSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS car.Car02_User.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
