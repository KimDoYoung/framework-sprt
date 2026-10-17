package kr.co.kfs.asseterp.biz.ifi.service;

import kr.co.kfs.asseterp.biz.ifi.dto.IfiConfigParam;
import kr.co.kfs.asseterp.biz.ifi.dto.IfiConfigRes;
import kr.co.kfs.asseterp.biz.ifi.dto.IfiConfigSaveReq;
import kr.co.kfs.asseterp.biz.ifi.mapper.IfiConfigMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/ifi/Ifi90_Config.java (selectByIfType L22 / update L27 / delete L32). 회사 구분 없는 공통 테이블 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IfiConfigService {

    private final IfiConfigMapper mapper;

    /** ifType이 비면 전체('%'), searchText는 양쪽에 '%' (AS-IS retrieve() L187-188) */
    public List<IfiConfigRes> search(String ifType, String searchText) {
        String type = ifType == null || ifType.isEmpty() ? "%" : ifType;
        return mapper.selectByIfType(new IfiConfigParam(type, "%" + (searchText == null ? "" : searchText) + "%"));
    }

    /** AS-IS update(UpdateDataModel): 화면 임시 ID(0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽는다 */
    @Transactional
    public IfiConfigRes update(IfiConfigSaveReq req) {
        boolean isNew = req.configId() == null || req.configId() <= 0;
        Long id = isNew ? mapper.selectNextId() : req.configId();
        if (isNew) {
            mapper.insertConfig(id, req);
        } else if (mapper.updateConfig(req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(id);
    }

    /** AS-IS delete: 하나라도 API·파일 설정이 쓰고 있으면 아무것도 지우지 않는다 → 지운 건수 */
    @Transactional
    public int delete(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        for (Long id : ids) {
            if (mapper.checkConfigId(id) != 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 설정정보 입니다.");
            }
        }
        return mapper.deleteConfigs(ids);
    }
}
