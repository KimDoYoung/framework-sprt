package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

public record CodeDeleteParam(Long companyId, List<Long> codeIds) {
}
