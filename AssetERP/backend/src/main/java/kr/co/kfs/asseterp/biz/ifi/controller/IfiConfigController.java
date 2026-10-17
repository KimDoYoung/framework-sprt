package kr.co.kfs.asseterp.biz.ifi.controller;

import kr.co.kfs.asseterp.biz.ifi.dto.IfiConfigRes;
import kr.co.kfs.asseterp.biz.ifi.dto.IfiConfigSaveReq;
import kr.co.kfs.asseterp.biz.ifi.service.IfiConfigService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** I/F 설정 (AS-IS Ifi90_Tab_Config → server/ifi/Ifi90_Config) — 메뉴 #1445 */
@RestController
@RequestMapping("/api/v1/ifi/configs")
@RequiredArgsConstructor
public class IfiConfigController {

    private final IfiConfigService service;

    /** AS-IS ifi.Ifi90_Config.selectByIfType */
    @GetMapping
    public ApiResponse<List<IfiConfigRes>> search(@RequestParam(required = false) String ifType,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(ifType, searchText));
    }

    /** AS-IS ifi.Ifi90_Config.update → 저장된 행 */
    @PutMapping
    public ApiResponse<IfiConfigRes> update(@RequestBody IfiConfigSaveReq req) {
        return ApiResponse.ok(service.update(req));
    }

    /** AS-IS ifi.Ifi90_Config.delete → 지운 건수 (사용중이면 오류) */
    @DeleteMapping
    public ApiResponse<Integer> delete(@RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(ids));
    }
}
