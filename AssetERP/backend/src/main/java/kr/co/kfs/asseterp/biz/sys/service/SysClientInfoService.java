package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.ClientInfoRes;
import kr.co.kfs.asseterp.biz.sys.dto.ClientInfoSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysClientInfoMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys85_ClientInfo.java (selectByText L24 / update L32 / delete L37) — 문자발송(관리자 메뉴)에서 쓰므로 sys admin만. 테이블에 회사 컬럼이 없다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysClientInfoService {

    private final SysClientInfoMapper mapper;

    /** AS-IS selectByText: 검색어는 클라이언트가 "%"+값+"%"로 보냈다 → 서버가 만든다 */
    public List<ClientInfoRes> search(UserPrincipal user, String searchText) {
        requireSysAdmin(user);
        return mapper.selectByText("%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS update(UpdateDataModel): 행마다 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<ClientInfoRes> update(UserPrincipal user, List<ClientInfoSaveReq> rows) {
        requireSysAdmin(user);
        List<ClientInfoRes> saved = new ArrayList<>();
        for (ClientInfoSaveReq req : rows) {
            boolean isNew = req.clientInfoId() == null || req.clientInfoId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.clientInfoId();
            if (isNew) {
                mapper.insertClientInfo(id, req);
            } else if (mapper.updateClientInfo(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteClientInfos(ids);
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
